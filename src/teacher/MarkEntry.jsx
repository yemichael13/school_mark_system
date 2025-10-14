import React, {useEffect, useMemo, useState} from "react";
import { Link } from "react-router-dom";
import "./MarkEntry.css";
import Navbar from "../components/Navbar";
import back from "../assets/back.png";
import hide from "../assets/hide.png";
import show from "../assets/show.png";
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

const MarkEntry = () => {
    const classes = [
        'KG 1',
        'KG 2',
        'KG 3',
        'Grade 1',
        'Grade 2',
        'Grade 3',
        'Grade 4',
    ];

    const subjectsByClass = {
        'KG 1': ['Math', 'Reading'],
        'KG 2': ['Math', 'Reading', 'Writing'],
        'KG 3': ['Math', 'Reading', 'Writing'],
        'Grade 1': ['Math', 'English', 'Science'],
        'Grade 2': ['Math', 'English', 'Science'],
        'Grade 3': ['Math', 'English', 'Science', 'Civics'],
        'Grade 4': ['Math', 'English', 'Science', 'Civics'],
    };

    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");
            try {
                const [studentsRes, subjectsRes] = await Promise.all([
                    api.get('/admin/students'),
                    api.get('/admin/subjects')
                ]);
                setStudents(studentsRes.data || []);
                setSubjects(subjectsRes.data || []);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const [selectedClass, setSelectedClass] = useState('All');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    // marks[studentId][subject] = number|string
    const [marks, setMarks] = useState({});
    const [results, setResults] = useState({}); // results[studentId] = { sum, average, rank }

    const filteredStudents = useMemo(() => (
        selectedClass === 'All' ? students : students.filter((s) => s.class === selectedClass)
    ), [selectedClass]);

    const availableSubjects = useMemo(() => {
        // For now, show all subjects regardless of class
        // In a real app, you might want to filter by class
        return subjects;
    }, [subjects]);

    const handleMarkChange = (studentId, subjectId, value) => {
        const numeric = value === '' ? '' : Number(value);
        if (value !== '' && Number.isNaN(numeric)) return;
        setMarks(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || {}),
                [subjectId]: value === '' ? '' : numeric,
            },
        }));
    };

    const calculateResults = () => {
        const newResults = {};
        const totals = [];
        filteredStudents.forEach(student => {
            const subjectScores = availableSubjects.map(subj => {
                const val = marks[student.id]?.[subj.id];
                return typeof val === 'number' ? val : 0;
            });
            const sum = subjectScores.reduce((a, b) => a + b, 0);
            const average = availableSubjects.length > 0 ? Number((sum / availableSubjects.length).toFixed(2)) : 0;
            totals.push({ studentId: student.id, sum });
            newResults[student.id] = { sum, average, rank: 0 };
        });
        // Rank by sum (higher is better); handle ties with same rank
        totals.sort((a, b) => b.sum - a.sum);
        let currentRank = 0;
        let lastSum = null;
        let seen = 0;
        totals.forEach(({ studentId, sum }) => {
            seen += 1;
            if (sum !== lastSum) {
                currentRank = seen;
                lastSum = sum;
            }
            newResults[studentId].rank = currentRank;
        });
        setResults(newResults);
    };

    async function persistMarks(term = 'Term1'){
        try {
            const payload = [];
            Object.entries(marks).forEach(([studentId, subjToMark]) => {
                Object.entries(subjToMark).forEach(([subjectId, mark]) => {
                    if (typeof mark === 'number') {
                        payload.push({ student_id: Number(studentId), subject_id: Number(subjectId), term, mark });
                    }
                });
            });
            // naive: send sequentially to match API shape
            for (const item of payload) {
                await api.post('/teacher/marks', item);
            }
            setError(''); // Clear any previous errors
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save marks');
        }
    }

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
                        <div className="markEntryHeader">
                            <h3>{selectedClass === 'All' ? 'All Students' : `${selectedClass} - Mark Entry`}</h3>
                            <button type="button" className="calcBtn" onClick={calculateResults}>Calculate</button>
                        </div>
                        <div className="tableWrap">
                            <table className="markTable">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        {availableSubjects.map(subj => (
                                            <th key={subj.id}>{subj.name}</th>
                                        ))}
                                        <th>Sum</th>
                                        <th>Average</th>
                                        <th>Rank</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map(student => (
                                        <tr key={student.id}>
                                            <td className="studentCell">{student.name}</td>
                                            {availableSubjects.map(subj => (
                                                <td key={subj.id}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="markInput"
                                                        value={marks[student.id]?.[subj.id] ?? ''}
                                                        onChange={(e) => handleMarkChange(student.id, subj.id, e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                            <td className="resultCell">{results[student.id]?.sum ?? ''}</td>
                                            <td className="resultCell">{results[student.id]?.average ?? ''}</td>
                                            <td className="resultCell">{results[student.id]?.rank ?? ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                            <button type="button" className="calcBtn" onClick={persistMarks}>Save Marks</button>
                        </div>
                        {selectedClass === 'All' && (
                            <p className="hint">Tip: select a specific class from the sidebar to see its subjects.</p>
                        )}
                    </div>
                </div>
            </section>
            
        </div>
    )
}


export default MarkEntry;