import React, {useState, useMemo} from "react";
import { Link } from "react-router-dom";
import "./MarkEntry.css";
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

    // marks[studentId][subject] = number|string
    const [marks, setMarks] = useState({});
    const [results, setResults] = useState({}); // results[studentId] = { sum, average, rank }

    const filteredStudents = useMemo(() => (
        selectedClass === 'All' ? students : students.filter((s) => s.class === selectedClass)
    ), [selectedClass]);

    const subjects = useMemo(() => {
        if (selectedClass === 'All') {
            // Union of all subjects to display something sensible
            const uniq = new Set();
            Object.values(subjectsByClass).forEach(arr => arr.forEach(s => uniq.add(s)));
            return Array.from(uniq);
        }
        return subjectsByClass[selectedClass] || [];
    }, [selectedClass]);

    const handleMarkChange = (studentId, subject, value) => {
        const numeric = value === '' ? '' : Number(value);
        if (value !== '' && Number.isNaN(numeric)) return;
        setMarks(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || {}),
                [subject]: value === '' ? '' : numeric,
            },
        }));
    };

    const calculateResults = () => {
        const newResults = {};
        const totals = [];
        filteredStudents.forEach(student => {
            const subjectScores = subjects.map(subj => {
                const val = marks[student.id]?.[subj];
                return typeof val === 'number' ? val : 0;
            });
            const sum = subjectScores.reduce((a, b) => a + b, 0);
            const average = subjects.length > 0 ? Number((sum / subjects.length).toFixed(2)) : 0;
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
                                        {subjects.map(subj => (
                                            <th key={subj}>{subj}</th>
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
                                            {subjects.map(subj => (
                                                <td key={subj}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="markInput"
                                                        value={marks[student.id]?.[subj] ?? ''}
                                                        onChange={(e) => handleMarkChange(student.id, subj, e.target.value)}
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