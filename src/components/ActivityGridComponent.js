import { getActivityColor, getActivityLevel } from '../../public/functions'
import styles from '../../styles/profilepage/activityGrid.module.css'

export default function ActivityGridComponent({ weeks }) {
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className={styles.activity__container}>
            <div className={styles.activity__grid}>
                <div className={styles.day__labels}>
                    {dayLabels.map((day, idx) => (
                        <div key={idx} className={styles.day__label}>
                            {day}
                        </div>
                    ))}
                </div>

                <div className={styles.weeks__container}>
                    {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className={styles.week}>
                            {week.map((day, dayIdx) => {
                                const level = getActivityLevel(day.count);
                                const color = getActivityColor(level);
                                const tooltip = day.count === 0 
                                    ? 'No activity' 
                                    : `${day.count} activity item${day.count > 1 ? 's' : ''} on ${day.date.toLocaleDateString()}`;
                                
                                return (
                                    <div
                                        key={dayIdx}
                                        className={styles.day__cell}
                                        style={{ backgroundColor: color }}
                                        title={tooltip}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}