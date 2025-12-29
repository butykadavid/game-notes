import styles from "../../styles/dashboard.module.css";

import { IoCalendarClearSharp } from "react-icons/io5";
import { SiCoveralls } from "react-icons/si";

import { MdVideogameAsset } from "react-icons/md";
import { IoImages } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlineHistoryEdu } from "react-icons/md";
import { MdAudioFile } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { MdRepeatOn } from "react-icons/md";

import { FaTrophy } from "react-icons/fa";

import { FaSortAmountDown } from "react-icons/fa";
import { FaSortAmountUp } from "react-icons/fa";

const ORDERING_OPTIONS = [
    { key: "created", label: "Created", icon: <IoCalendarClearSharp /> },
    { key: "overall", label: "Ovr", icon: <SiCoveralls /> },
    { key: "gameplay", label: "Gmp", icon: <MdVideogameAsset /> },
    { key: "atmosphere", label: "Atm", icon: <IoImages /> },
    { key: "visuals", label: "Vis", icon: <HiSparkles /> },
    { key: "story", label: "Sto", icon: <MdOutlineHistoryEdu /> },
    { key: "characters", label: "Cha", icon: <MdAudioFile /> },
    { key: "audio", label: "Aud", icon: <FaUsers /> },
    { key: "replayability", label: "Rpl", icon: <MdRepeatOn /> },
    { key: "platinum", label: "Plat", icon: <FaTrophy /> },
];

const DIRECTIONS = [
    { key: "DESC", icon: <FaSortAmountDown /> },
    { key: "ASC", icon: <FaSortAmountUp /> }
];

export default function ReviewFilter({ ordering, setOrdering, direction, setDirection }) {
    return (
        <div className={styles.filterBar__container}>
            <div className={styles.ordering}>
                <p>Order by</p>
                <div>
                    {ORDERING_OPTIONS.map(({ key, label, icon }) => (
                        <button
                            key={key}
                            className={`${styles.filterButton} ${ordering === key ? styles.toggled : ""
                                }`}
                            onClick={() =>
                                setOrdering(prev => (prev === key ? "created" : key))
                            }
                        >
                            {icon || label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.direction}>
                <p>Direction</p>
                <div>
                    {DIRECTIONS.map(({ key, icon }) => (
                        <button
                            key={key}
                            className={`${styles.filterButton} ${direction === key ? styles.toggled : ""
                                }`}
                            onClick={() => setDirection(key)}
                        >
                            {icon || key}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
