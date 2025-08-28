import React, { useMemo, useState } from "react";
import back from "../assets/back.png";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import hide from "../assets/hide.png";
import show from "../assets/show.png";
import "../teacher/StudOverview.css";
import "./ManageStudents.css";
import "./ManageTeachers.css";

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

const initialTeachers = [
    { id: 1, name: 'Mr. Tesfaye', class: 'KG 1' },
    { id: 2, name: 'Ms. Aster', class: 'KG 2' },
    { id: 3, name: 'Mr. Dawit', class: 'Grade 1' },
];

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
    const [selectedClass, setSelectedClass] = useState('All');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [formName, setFormName] = useState("");
    const [formClass, setFormClass] = useState(classes[0]);

    const filteredTeachers = useMemo(() => (
        selectedClass === 'All' ? teachers : teachers.filter(t => t.class === selectedClass)
    ), [selectedClass, teachers]);

    function openAddModal(){
        setModalMode('add');
        setEditingTeacher(null);
        setFormName("");
        setFormClass(selectedClass !== 'All' ? selectedClass : classes[0]);
        setIsModalOpen(true);
    }
    function openUpdateModal(teacher){
        setModalMode('update');
        setEditingTeacher(teacher);
        setFormName(teacher.name);
        setFormClass(teacher.class);
        setIsModalOpen(true);
    }
    function openDeleteModal(teacher){
        setModalMode('delete');
        setEditingTeacher(teacher);
        setIsModalOpen(true);
    }
    function closeModal(){ setIsModalOpen(false); }

    function handleSubmit(e){
        e.preventDefault();
        if(modalMode === 'add'){
            const nextId = teachers.length ? Math.max(...teachers.map(t => t.id)) + 1 : 1;
            setTeachers(prev => ([...prev, { id: nextId, name: formName.trim(), class: formClass }]));
        }else if(modalMode === 'update' && editingTeacher){
            setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? { ...t, name: formName.trim(), class: formClass } : t));
        }else if(modalMode === 'delete' && editingTeacher){
            setTeachers(prev => prev.filter(t => t.id !== editingTeacher.id));
        }
        setIsModalOpen(false);
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
                            <h3>{selectedClass === 'All' ? 'All Teachers' : `${selectedClass} Teachers`}</h3>
                            <button className="primaryBtn" onClick={openAddModal}>Add Teacher</button>
                        </div>
                        <ul className="studentsList">
                            {filteredTeachers.map((teacher) => (
                                <li key={teacher.id} className="studentItem">
                                    <div className="studentRow">
                                        <span>{teacher.name}</span>
                                        <div className="rowRight">
                                            <span className="studentClass">{teacher.class}</span>
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