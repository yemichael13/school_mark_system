import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import back from "../assets/back.png";
import hide from "../assets/hide.png";
import show from "../assets/show.png";
import "../teacher/StudOverview.css";
import "./ManageStudents.css";
import api from "../api/client";

function Sidebar({ classes, selectedClass, onSelect, isVisible, onHide }){
    return (
        <aside className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
            {isVisible && (
                <button
                    type="button"
                    className="sidebarHideBtn"
                    onClick={onHide}
                    aria-label="Hide sidebar"
                >
                    <img src={hide} alt="Hide sidebar" />
                </button>
            )}
            <h3>Classes</h3>
            <ul className="classList">
                <li>
                    <button
                        onClick={() => onSelect('All')}
                        className={`classBtn ${selectedClass === 'All' ? 'active' : ''}`}
                    >
                        <span className="classLabel">All</span>
                    </button>
                </li>
                {classes.map((cls) => (
                    <li key={cls}>
                        <button
                            onClick={() => onSelect(cls)}
                            className={`classBtn ${selectedClass === cls ? 'active' : ''}`}
                        >
                            <span className="classLabel">{cls}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

const initialStudents = [];

const ManageStudents = () => {
    const classes = [
        'KG 1',
        'KG 2',
        'KG 3',
        'Grade 1',
        'Grade 2',
        'Grade 3',
        'Grade 4',
    ];

    const [students, setStudents] = useState(initialStudents);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedClass, setSelectedClass] = useState('All');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' | 'update' | 'delete'
    const [editingStudent, setEditingStudent] = useState(null);
    const [formName, setFormName] = useState("");
    const [formClass, setFormClass] = useState(classes[0]);

    const filteredStudents = useMemo(() => (
        selectedClass === 'All'
            ? students
            : students.filter((s) => s.class === selectedClass)
    ), [selectedClass, students]);

    function openAddModal() {
        setModalMode('add');
        setEditingStudent(null);
        setFormName("");
        setFormClass(selectedClass !== 'All' ? selectedClass : classes[0]);
        setIsModalOpen(true);
    }

    function openUpdateModal(student) {
        setModalMode('update');
        setEditingStudent(student);
        setFormName(student.name);
        setFormClass(student.class);
        setIsModalOpen(true);
    }

    function openDeleteModal(student) {
        setModalMode('delete');
        setEditingStudent(student);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");
            try {
                const res = await api.get('/admin/students');
                setStudents(res.data || []);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load students');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                const res = await api.post('/admin/students', { name: formName.trim(), class: formClass });
                const created = { id: res.data?.id, name: formName.trim(), class: formClass };
                setStudents(prev => ([...prev, created]));
            } else if (modalMode === 'update' && editingStudent) {
                await api.put(`/admin/students/${editingStudent.id}`, { name: formName.trim(), class: formClass });
                setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, name: formName.trim(), class: formClass } : s));
            } else if (modalMode === 'delete' && editingStudent) {
                await api.delete(`/admin/students/${editingStudent.id}`);
                setStudents(prev => prev.filter(s => s.id !== editingStudent.id));
            }
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    }

    return(
        <div className="manageStudents">
            <Navbar />
            <section className="overviewContainer">
                <div className="back">
                    <Link to="/AdminDashboard">
                        <button><img src={back} alt="back" /></button>
                    </Link>
                </div>

                {!isSidebarVisible && (
                    <button
                        type="button"
                        className="sidebarReopen"
                        onClick={() => setIsSidebarVisible(true)}
                        aria-label="Show sidebar"
                    >
                        <img src={show} alt="Show sidebar" />
                    </button>
                )}

                <Sidebar
                    classes={classes}
                    selectedClass={selectedClass}
                    onSelect={setSelectedClass}
                    isVisible={isSidebarVisible}
                    onHide={() => setIsSidebarVisible(false)}
                />

                <div className={`overviewGrid ${isSidebarVisible ? 'withSidebar' : 'fullWidth'}`}>
                    <div className="studentsPanel">
                        <div className="panelHeader">
                            <h3>{selectedClass === 'All' ? 'All Students' : `${selectedClass} Students`}</h3>
                            <button className="primaryBtn" onClick={openAddModal}>Add Student</button>
                        </div>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <ul className="studentsList">
                            {filteredStudents.map((student) => (
                                <li key={student.id} className="studentItem">
                                    <div className="studentRow">
                                        <span>{student.name}</span>
                                        <div className="rowRight">
                                            <span className="studentClass">{student.class}</span>
                                            <div className="rowActions">
                                                <button className="secondaryBtn" onClick={() => openUpdateModal(student)}>Update</button>
                                                <button className="dangerBtn" onClick={() => openDeleteModal(student)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="modalOverlay" role="dialog" aria-modal="true">
                        <div className="modalContent">
                            {modalMode !== 'delete' ? (
                                <form onSubmit={handleSubmit} className="modalForm">
                                    <h3>{modalMode === 'add' ? 'Add Student' : 'Update Student'}</h3>
                                    <label>
                                        <span>Name</span>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        <span>Class</span>
                                        <select value={formClass} onChange={(e) => setFormClass(e.target.value)}>
                                            {classes.map(cls => (
                                                <option key={cls} value={cls}>{cls}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <div className="modalActions">
                                        <button type="button" className="secondaryBtn" onClick={closeModal}>Cancel</button>
                                        <button type="submit" className="primaryBtn">{modalMode === 'add' ? 'Add' : 'Update'}</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="modalForm">
                                    <h3>Delete Student</h3>
                                    <p>Are you sure you want to delete <strong>{editingStudent?.name}</strong>?</p>
                                    <div className="modalActions">
                                        <button type="button" className="secondaryBtn" onClick={closeModal}>Cancel</button>
                                        <button type="button" className="dangerBtn" onClick={handleSubmit}>Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}

export default ManageStudents;