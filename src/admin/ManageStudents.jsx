import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import back from "../assets/back.png";
import hide from "../assets/hide.png";
import show from "../assets/show.png";
import "../teacher/StudOverview.css";
import "./ManageStudents.css";

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

const initialStudents = [
    { id: 1, name: 'Abel Bekele', class: 'KG 1' },
    { id: 2, name: 'Sara Teshome', class: 'KG 1' },
    { id: 3, name: 'Meklit Alemu', class: 'KG 2' },
    { id: 4, name: 'Yonatan Girma', class: 'KG 3' },
    { id: 5, name: 'Lily Solomon', class: 'Grade 1' },
    { id: 6, name: 'Noah Hailu', class: 'Grade 1' },
    { id: 7, name: 'Hanna Daniel', class: 'Grade 2' },
    { id: 8, name: 'Fikir Tesfaye', class: 'Grade 3' },
    { id: 9, name: 'Beti Meron', class: 'Grade 4' },
];

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

    function handleSubmit(e) {
        e.preventDefault();
        if (modalMode === 'add') {
            const nextId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
            setStudents(prev => ([...prev, { id: nextId, name: formName.trim(), class: formClass }]));
        } else if (modalMode === 'update' && editingStudent) {
            setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, name: formName.trim(), class: formClass } : s));
        } else if (modalMode === 'delete' && editingStudent) {
            setStudents(prev => prev.filter(s => s.id !== editingStudent.id));
        }
        setIsModalOpen(false);
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