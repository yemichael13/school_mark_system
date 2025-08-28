import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./StudOverview.css";
import Navbar from "../components/Navbar";
import back from "../assets/back.png";
import hide from "../assets/hide.png";
import show from "../assets/show.png";

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

const StudOverview = () => {
    const classes = [
        'KG 1',
        'KG 2',
        'KG 3',
        'Grade 1',
        'Grade 2',
        'Grade 3',
        'Grade 4',
    ];

    const students = [
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

    const [selectedClass, setSelectedClass] = useState('All');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const filteredStudents = selectedClass === 'All'
        ? students
        : students.filter((s) => s.class === selectedClass);

    return(
        <div className="studOverview">
            <Navbar />
            <section className="overviewContainer">
                <div className="back">
                    <Link to="/TeacherDashboard">
                            
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
                        <h3>{selectedClass === 'All' ? 'All Students' : `${selectedClass} Students`}</h3>
                        <ul className="studentsList">
                            {filteredStudents.map((student) => (
                                <li key={student.id} className="studentItem">
                                    <div className="studentRow">
                                        <span>{student.name}</span>
                                        <span className="studentClass">{student.class}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            
        </div>
    )
}

export default StudOverview;