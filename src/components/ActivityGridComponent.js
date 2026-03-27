import { useCallback, useState } from 'react';
import styles from '../../styles/profilepage/activityGrid.module.css'

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const getActivityLevel = (count) => {
    if (count === 0) return
    if (count === 1) return styles.day__level__1;
    if (count <= 3) return styles.day__level__2;
    if (count <= 5) return styles.day__level__3;
    return styles.day__level__4;
}

export default function ActivityGridComponent({ activityData }) {
    const [tooltip, setTooltip] = useState(null);

    const Content = useCallback(() => {
        const today = new Date();

        let dayGrids = [];
        for (let i = 0; i < 365; i++) {
            let temp = today.addDays(i * -1);
            let dayGridDate = new Date(temp).toLocaleDateString('en-CA').toString();
            let dayActivities = activityData.filter(item => item.date.toLocaleDateString('en-CA').toString() === dayGridDate);
            
            if (dayActivities.length > 0) {
                const count = dayActivities.length;
                dayGrids.unshift(
                    <div 
                        className={`${styles.day} ${getActivityLevel(count)}`} 
                        key={i}
                        onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, activities: dayActivities, date: temp })}
                        onMouseLeave={() => setTooltip(null)}
                    />
                );
            } else {
                dayGrids.unshift(<div 
                        className={styles.day} 
                        key={i}
                        onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, activities: dayActivities, date: temp })}
                        onMouseLeave={() => setTooltip(null)}
                    />);
            }
        }

        return (
            <div className={styles.days}>
                {dayGrids}
            </div>
        )
    }, [activityData])

    return <>
        <div className={styles.activity__grid}>
            <Content />
        </div>
        {tooltip && (
            <div 
                className={styles.tooltip}
                style={{
                    position: 'fixed',
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y + 10}px`,
                    zIndex: 1000,
                }}
            >
                <div className={styles.tooltip__header}>{tooltip.date.toLocaleDateString()}</div>
                <div className={styles.tooltip__content}>
                    {tooltip.activities.map((activity, idx) => (
                        <div key={idx} className={styles.tooltip__item}>
                            <span className={styles.tooltip__type} data-type={activity.type.toLowerCase()}>
                                {activity.type.substring(0, 1).toUpperCase()}
                            </span>
                            <span className={styles.tooltip__title}>{activity.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>
}