import React, { useEffect, useState } from "react";
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

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // add | update | delete
    const [editingSubject, setEditingSubject] = useState(null);
    const [formName, setFormName] = useState("");
    const [formCode, setFormCode] = useState("");
    const [formClasses, setFormClasses] = useState([]);

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get('/admin/subjects');
            setSubjects(res.data || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    function openAddModal(){
        setModalMode('add');
        setEditingSubject(null);
        setFormName("");
        setFormCode("");
        setFormClasses([]);
        setIsModalOpen(true);
    }
    
    function openUpdateModal(subject){
        setModalMode('update');
        setEditingSubject(subject);
        setFormName(subject.name);
        setFormCode(subject.code);
        setFormClasses(subject.classes ? subject.classes.split(',') : []);
        setIsModalOpen(true);
    }
    
    function openDeleteModal(subject){
        setModalMode('delete');
        setEditingSubject(subject);
        setIsModalOpen(true);
    }
    
    function closeModal(){ 
        setIsModalOpen(false); 
        setEditingSubject(null);
        setFormName("");
        setFormCode("");
        setFormClasses([]);
    }

    const handleClassToggle = (className) => {
        setFormClasses(prev => 
            prev.includes(className) 
                ? prev.filter(c => c !== className)
                : [...prev, className]
        );
    };

    async function handleSubmit(e){
        e.preventDefault();
        try {
            if(modalMode === 'add'){
                await api.post('/admin/subjects', { 
                    name: formName.trim(), 
                    code: formCode.trim().toUpperCase(),
                    classes: formClasses
                });
                await loadSubjects();
            }else if(modalMode === 'update' && editingSubject){
                await api.put(`/admin/subjects/${editingSubject.id}`, { 
                    name: formName.trim(), 
                    code: formCode.trim().toUpperCase(),
                    classes: formClasses
                });
                await loadSubjects();
            }else if(modalMode === 'delete' && editingSubject){
                await api.delete(`/admin/subjects/${editingSubject.id}`);
                await loadSubjects();
            }
            closeModal();
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

                <div className={`overviewGrid ${isSidebarVisible ? 'withSidebar' : 'fullWidth'}`}>
                    <div className="studentsPanel">
                        <div className="panelHeader">
                            <h3>Manage Subjects</h3>
                            <button className="primaryBtn" onClick={openAddModal}>Add Subject</button>
                        </div>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="subjectsTable">
                            <table className="subjectsTable">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Classes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject) => (
                                        <tr key={subject.id}>
                                            <td className="subjectName">{subject.name}</td>
                                            <td className="subjectCode">{subject.code}</td>
                                            <td className="subjectClasses">{subject.classes || 'No classes assigned'}</td>
                                            <td className="subjectActions">
                                                <button className="secondaryBtn" onClick={() => openUpdateModal(subject)}>Update</button>
                                                <button className="dangerBtn" onClick={() => openDeleteModal(subject)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="modalOverlay" role="dialog" aria-modal="true">
                        <div className="modalContent">
                            {modalMode !== 'delete' ? (
                                <form onSubmit={handleSubmit} className="modalForm">
                                    <h3>{modalMode === 'add' ? 'Add Subject' : 'Update Subject'}</h3>
                                    <label>
                                        <span>Subject Name</span>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        <span>Subject Code</span>
                                        <input
                                            type="text"
                                            value={formCode}
                                            onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                                            placeholder="e.g., MATH, ENG, SCI"
                                            required
                                        />
                                    </label>
                                    <label>
                                        <span>Assign to Classes</span>
                                        <div className="classCheckboxes">
                                            {classes.map(className => (
                                                <label key={className} className="checkboxLabel">
                                                    <input
                                                        type="checkbox"
                                                        checked={formClasses.includes(className)}
                                                        onChange={() => handleClassToggle(className)}
                                                    />
                                                    <span>{className}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </label>
                                    <div className="modalActions">
                                        <button type="button" className="secondaryBtn" onClick={closeModal}>Cancel</button>
                                        <button type="submit" className="primaryBtn">{modalMode === 'add' ? 'Add' : 'Update'}</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="modalForm">
                                    <h3>Delete Subject</h3>
                                    <p>Are you sure you want to delete <strong>{editingSubject?.name}</strong> ({editingSubject?.code})?</p>
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