import React, { useEffect, useState } from "react";
import back from "../assets/back.png";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import hide from "../assets/hide.png";
import show from "../assets/show.png";
import "../teacher/StudOverview.css";
import "./ManageStudents.css";
import "./ViewMarks.css";
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

const ViewMarks = () => {
    const classes = [
        'KG 1',
        'KG 2',
        'KG 3',
        'Grade 1',
        'Grade 2',
        'Grade 3',
        'Grade 4',
    ];

    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedTerm, setSelectedTerm] = useState('All');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const filteredMarks = marks.filter(mark => {
        const classMatch = selectedClass === 'All' || mark.class === selectedClass;
        const termMatch = selectedTerm === 'All' || mark.term === selectedTerm;
        return classMatch && termMatch;
    });

    useEffect(() => {
        loadMarks();
    }, []);

    const loadMarks = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get('/admin/marks');
            setMarks(res.data || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load marks');
        } finally {
            setLoading(false);
        }
    };

    const loadMarksByTerm = async (term) => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`/admin/marks?term=${term}`);
            setMarks(res.data || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load marks');
        } finally {
            setLoading(false);
        }
    };

    const handleTermChange = (term) => {
        setSelectedTerm(term);
        if (term === 'All') {
            loadMarks();
        } else {
            loadMarksByTerm(term);
        }
    };

    return(
        <div className="viewMarks">
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
                    <div className="marksPanel">
                        <div className="panelHeader">
                            <h3>View All Marks</h3>
                            <div className="filterControls">
                                <div className="termFilter">
                                    <label htmlFor="termFilter">Filter by Term:</label>
                                    <select 
                                        id="termFilter"
                                        value={selectedTerm} 
                                        onChange={(e) => handleTermChange(e.target.value)}
                                        className="termSelect"
                                    >
                                        <option value="All">All Terms</option>
                                        <option value="Term1">Term 1</option>
                                        <option value="Term2">Term 2</option>
                                    </select>
                                </div>
                                <button className="refreshBtn" onClick={loadMarks}>Refresh</button>
                            </div>
                        </div>
                        
                        {loading && <p>Loading marks...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        
                        <div className="tableWrap">
                            <table className="marksTable">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Class</th>
                                        <th>Subject</th>
                                        <th>Term</th>
                                        <th>Mark</th>
                                        <th>Grade</th>
                                        <th>Teacher</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMarks.map((mark) => (
                                        <tr key={mark.id}>
                                            <td className="studentCell">{mark.student_name}</td>
                                            <td className="classCell">{mark.class}</td>
                                            <td className="subjectCell">{mark.subject_name}</td>
                                            <td className="termCell">{mark.term}</td>
                                            <td className="markCell">{mark.mark}</td>
                                            <td className="gradeCell">{mark.grade}</td>
                                            <td className="teacherCell">{mark.teacher_name}</td>
                                            <td className="dateCell">{new Date(mark.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredMarks.length === 0 && !loading && (
                            <p className="noData">No marks found for the selected criteria.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ViewMarks;
