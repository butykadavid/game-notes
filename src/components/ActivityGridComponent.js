import { useCallback } from 'react';
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

    const Content = useCallback(() => {
        const today = new Date();

        let daysRecorded = activityData.map(item => item.date.toLocaleDateString('en-CA').toString());
        let dayGrids = [];
        for (let i = 0; i < 365; i++) {
            let temp = today.addDays(i * -1);
            let dayGridDate = new Date(temp).toLocaleDateString('en-CA').toString();
            if (daysRecorded.includes(dayGridDate)) {
                let count = activityData.filter(item => item.date.toLocaleDateString('en-CA').toString() === dayGridDate).length;
                dayGrids.unshift(<div className={`${styles.day} ${getActivityLevel(count)}`} key={i} title={`${count} activitie(s) on ${temp.toLocaleDateString()}`} />);
            } else {
                dayGrids.unshift(<div className={styles.day} key={i} title={temp.toLocaleDateString()}/>);
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
    </>
}