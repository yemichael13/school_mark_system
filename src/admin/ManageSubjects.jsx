import React, { useEffect, useMemo, useState } from "react";
import back from "../assets/back.png";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import hide from "../assets/hide.png";
import show from "../assets/show.png";
import "../teacher/StudOverview.css";
import "./ManageStudents.css";
import "./ManageSubjects.css";
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

const ManageSubjects = () =>{
    const classes = [
        'KG 1',
        'KG 2',
        'KG 3',
        'Grade 1',
        'Grade 2',
        'Grade 3',
        'Grade 4',
    ];

    const [selectedClass, setSelectedClass] = useState('KG 1');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [classToSubjects, setClassToSubjects] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");
            try {
                const res = await api.get('/admin/subjects');
                // Assuming backend returns flat list of subjects with name and class
                const list = res.data || [];
                const map = {};
                classes.forEach(cls => { map[cls] = []; });
                list.forEach(s => {
                    const cls = s.class || 'Grade 1';
                    if (!map[cls]) map[cls] = [];
                    map[cls].push(s.name);
                });
                setClassToSubjects(map);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load subjects');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const subjects = useMemo(() => classToSubjects[selectedClass] || [], [classToSubjects, selectedClass]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // add | update | delete
    const [editingSubject, setEditingSubject] = useState("");
    const [formSubject, setFormSubject] = useState("");

    function openAddModal(){
        setModalMode('add');
        setEditingSubject("");
        setFormSubject("");
        setIsModalOpen(true);
    }
    function openUpdateModal(subject){
        setModalMode('update');
        setEditingSubject(subject);
        setFormSubject(subject);
        setIsModalOpen(true);
    }
    function openDeleteModal(subject){
        setModalMode('delete');
        setEditingSubject(subject);
        setIsModalOpen(true);
    }
    function closeModal(){ setIsModalOpen(false); }

    async function handleSubmit(e){
        e.preventDefault();
        try {
            if(modalMode === 'add'){
                const res = await api.post('/admin/subjects', { name: formSubject.trim(), class: selectedClass });
                setClassToSubjects(prev => ({
                    ...prev,
                    [selectedClass]: [...(prev[selectedClass] || []), formSubject.trim()].filter(Boolean)
                }));
            }else if(modalMode === 'update'){
                // This assumes unique subject per class and we need an id; as a fallback we don't have it here
                await api.put(`/admin/subjects/${encodeURIComponent(editingSubject)}`, { name: formSubject.trim(), class: selectedClass });
                setClassToSubjects(prev => ({
                    ...prev,
                    [selectedClass]: (prev[selectedClass] || []).map(s => s === editingSubject ? formSubject.trim() : s)
                }));
            }else if(modalMode === 'delete'){
                await api.delete(`/admin/subjects/${encodeURIComponent(editingSubject)}`);
                setClassToSubjects(prev => ({
                    ...prev,
                    [selectedClass]: (prev[selectedClass] || []).filter(s => s !== editingSubject)
                }));
            }
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    }

    return(
        <div className="manageSubjects">
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
                            <h3>{selectedClass} Subjects</h3>
                            <button className="primaryBtn" onClick={openAddModal}>Add Subject</button>
                        </div>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <ul className="studentsList">
                            {subjects.map((subject, idx) => (
                                <li key={`${subject}-${idx}`} className="studentItem">
                                    <div className="studentRow">
                                        <span>{subject}</span>
                                        <div className="rowRight">
                                            <div className="rowActions">
                                                <button className="secondaryBtn" onClick={() => openUpdateModal(subject)}>Update</button>
                                                <button className="dangerBtn" onClick={() => openDeleteModal(subject)}>Delete</button>
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
                                    <h3>{modalMode === 'add' ? 'Add Subject' : 'Update Subject'}</h3>
                                    <label>
                                        <span>Subject</span>
                                        <input
                                            type="text"
                                            value={formSubject}
                                            onChange={(e) => setFormSubject(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <div className="modalActions">
                                        <button type="button" className="secondaryBtn" onClick={closeModal}>Cancel</button>
                                        <button type="submit" className="primaryBtn">{modalMode === 'add' ? 'Add' : 'Update'}</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="modalForm">
                                    <h3>Delete Subject</h3>
                                    <p>Are you sure you want to delete <strong>{editingSubject}</strong> from {selectedClass}?</p>
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

export default ManageSubjects;