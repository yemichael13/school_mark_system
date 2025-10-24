import React, { useEffect, useMemo, useState } from "react";
import back from "../assets/back.png";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import hide from "../assets/hide.png";
import show from "../assets/show.png";
import "../teacher/StudOverview.css";
import "./ManageStudents.css";
import "./ManageTeachers.css";
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

const initialTeachers = [];

const ManageTeachers = () =>{
    const classes = [
        'KG 1',
        'KG 2',
        'KG 3',
        'Grade 1',
        'Grade 2',
        'Grade 3',
        'Grade 4',
    ];

    const [teachers, setTeachers] = useState(initialTeachers);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedClass, setSelectedClass] = useState('All');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");

    const filteredTeachers = teachers; // No class filtering needed

    function openAddModal(){
        setModalMode('add');
        setEditingTeacher(null);
        setFormName("");
        setFormEmail("");
        setFormPassword("");
        setIsModalOpen(true);
    }
    function openUpdateModal(teacher){
        setModalMode('update');
        setEditingTeacher(teacher);
        setFormName(teacher.name);
        setFormEmail(teacher.email);
        setFormPassword(""); // Don't pre-fill password
        setIsModalOpen(true);
    }
    function openDeleteModal(teacher){
        setModalMode('delete');
        setEditingTeacher(teacher);
        setIsModalOpen(true);
    }
    function closeModal(){ setIsModalOpen(false); }

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");
            try {
                const res = await api.get('/admin/teachers');
                setTeachers(res.data || []);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load teachers');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function handleSubmit(e){
        e.preventDefault();
        try {
            if(modalMode === 'add'){
                const res = await api.post('/admin/teachers', { 
                    name: formName.trim(), 
                    email: formEmail.trim(), 
                    password: formPassword || 'password123' 
                });
                const createdId = res.data?.id;
                const created = { id: createdId, name: formName.trim(), email: formEmail.trim() };
                setTeachers(prev => ([...prev, created]));
            }else if(modalMode === 'update' && editingTeacher){
                const updateData = { 
                    name: formName.trim(), 
                    email: formEmail.trim() 
                };
                if (formPassword) {
                    updateData.password = formPassword;
                }
                await api.put(`/admin/teachers/${editingTeacher.id}`, updateData);
                setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? { 
                    ...t, 
                    name: formName.trim(), 
                    email: formEmail.trim() 
                } : t));
            }else if(modalMode === 'delete' && editingTeacher){
                await api.delete(`/admin/teachers/${editingTeacher.id}`);
                setTeachers(prev => prev.filter(t => t.id !== editingTeacher.id));
            }
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    }

    return(
        <div className="manageTeachers">
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
                            <h3>All Teachers</h3>
                            <button className="primaryBtn" onClick={openAddModal}>Add Teacher</button>
                        </div>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <ul className="studentsList">
                            {filteredTeachers.map((teacher) => (
                                <li key={teacher.id} className="studentItem">
                                    <div className="studentRow">
                                        <div className="teacherInfo">
                                            <span className="teacherName">{teacher.name}</span>
                                            <span className="teacherEmail">{teacher.email}</span>
                                        </div>
                                        <div className="rowRight">
                                            <div className="rowActions">
                                                <button className="secondaryBtn" onClick={() => openUpdateModal(teacher)}>Update</button>
                                                <button className="dangerBtn" onClick={() => openDeleteModal(teacher)}>Delete</button>
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
                                    <h3>{modalMode === 'add' ? 'Add Teacher' : 'Update Teacher'}</h3>
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
                                        <span>Email</span>
                                        <input
                                            type="email"
                                            value={formEmail}
                                            onChange={(e) => setFormEmail(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        <span>Password {modalMode === 'update' && '(leave blank to keep current)'}</span>
                                        <input
                                            type="password"
                                            value={formPassword}
                                            onChange={(e) => setFormPassword(e.target.value)}
                                            required={modalMode === 'add'}
                                        />
                                    </label>
                                    <div className="modalActions">
                                        <button type="button" className="secondaryBtn" onClick={closeModal}>Cancel</button>
                                        <button type="submit" className="primaryBtn">{modalMode === 'add' ? 'Add' : 'Update'}</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="modalForm">
                                    <h3>Delete Teacher</h3>
                                    <p>Are you sure you want to delete <strong>{editingTeacher?.name}</strong>?</p>
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

export default ManageTeachers;