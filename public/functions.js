const getOvrRating = (game) => {

    if (game == null) return 0

    // calculating overall rating
    // the multipliers are there for weights for certain stats
    // if a stat is 0 it doesn't count

    var invalids = 0;
    if (game.gameplay == 0) invalids += 4;
    if (game.story == 0) invalids += 3;
    if (game.atmosphere == 0) invalids += 4;
    if (game.visuals == 0) invalids += 3;
    if (game.characters == 0) invalids += 2;
    if (game.audio == 0) invalids += 2;
    if (game.replayability == 0) invalids++;

    var ovr = (Number(game.gameplay) * 4) + (Number(game.story) * 3) + (Number(game.atmosphere) * 4) +
        (Number(game.visuals) * 3) + (Number(game.characters) * 2) + (Number(game.audio) * 2) + Number(game.replayability);

    return Math.floor(ovr / (19 - invalids));
}

const getColor = n => {
    if (n >= 90) return "#00ff36"
    else if (n >= 80 && n < 90) return "#7ae900"
    else if (n >= 70 && n < 80) return "#a6d100"
    else if (n >= 60 && n < 70) return "#c6b600"
    else if (n >= 50 && n < 60) return "#de9900"
    else if (n >= 40 && n < 50) return "#f07800"
    else if (n >= 30 && n < 40) return "#fb5000"
    else if (n >= 20 && n < 30) return "#ff0000"
    else if (n >= 10 && n < 20) return "#690000"
    else if (n < 10) return "#000000"
}

const getDayFormat = (day) => {
    return day.toString().length == 1 ? `0${day}` : day
}

const getDateFromTimestamp = (timestamp) => {
    return new Date(timestamp * 1000);
}

const getFormattedDate = (date) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];
    return date.getFullYear() + "." + months[date.getMonth()] + "." + getDayFormat(date.getDate());
}

const redirectToPage = (router, path, query) => {
    router.push({
        pathname: path,
        query: query
    })
}

const toSearchWordsArray = (str) => {

    const searchArray = []

    const words = str.toLowerCase().split(' ')

    words.forEach(word => {
        for (let i = 0; i < word.length; i++) {
            searchArray.push(word.substring(0, i + 1))
        }
    });

    return searchArray
}

const normalizeGameTitle = (raw) => {
    if (!raw) return "";

    let s = String(raw);

    s = s.replace(/[|/]+/g, " ");

    s = s.replace(/[\u2122\u00AE\u00A9]/g, "");

    s = s.replace(/\u00A0/g, " ");      // NBSP -> space
    s = s.replace(/\s+/g, " ").trim();

    const platforms = [
        "xbox", "xbox one", "xbox series x", "xbox series s", "xbox series",
        "playstation", "ps5", "ps4", "ps3", "ps2", "ps1", "ps",
        "switch", "nintendo switch", "pc", "steam", "epic", "stadia", "origin"
    ];
    const editions = [
        "deluxe", "gold", "ultimate", "game of the year", "goty", "standard edition",
        "complete edition", "remastered", "remaster", "hd collection", "definitive edition",
        "anniversary edition", "bundle", "cross gen", "cross-gen", "cross gen bundle",
        "collector's edition", "collector edition", "edition"
    ];

    const escapeForRegex = (arr) => arr
        .map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");

    const platformRegexPart = escapeForRegex(platforms);
    const editionRegexPart = escapeForRegex(editions);

    const parenPattern = new RegExp(
        `\\([^)]*\\b(?:${platformRegexPart}|${editionRegexPart})\\b[^)]*\\)`,
        "gi"
    );
    s = s.replace(parenPattern, "");

    const trailingSegmentPattern = new RegExp(
        `(?:[\\-–—:\\|]\\s*)[^\\-–—:\\|]*\\b(?:${platformRegexPart}|${editionRegexPart})\\b.*$`,
        "i"
    );
    s = s.replace(trailingSegmentPattern, "");

    const leftoverPlatformEdition = new RegExp(`\\b(?:${platformRegexPart}|${editionRegexPart})\\b`, "gi");
    s = s.replace(leftoverPlatformEdition, "");

    s = s.replace(/[|\/]+/g, " ");              // safety: convert leftover to spaces
    s = s.replace(/\s+[-—–]\s+/g, " - ");       // normalize interior hyphens to single spaced hyphen
    s = s.replace(/[:\-\—\–\|]+$/g, "");        // remove trailing :, -, | etc
    s = s.replace(/\s+/g, " ").trim();

    return s;
}

const generateActivityGrid = (activityData) => {
    const activityMap = new Map();
    
    activityData.forEach(item => {
        const date = item.date
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const weeks = [];
    let currentDate = new Date(startDate);
    
    while (currentDate.getTime() <= today.getTime()) {
        const week = [];
        
        for (let i = 0; i < 7; i++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            const count = activityMap.get(dateStr) || 0;
            
            week.push({
                date: new Date(currentDate),
                dateStr: dateStr,
                count: count,
                dayOfWeek: i
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        weeks.push(week);
    }
    
    return weeks;
}

const getActivityLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
}

const getActivityColor = (level) => {
    const colors = {
        0: '#202040', 
        1: '#00755A', 
        2: '#00A37D', 
        3: '#00D1A0',
        4: '#00FFC3' 
    };

    return colors[level] || colors[0];
}

export {
    getOvrRating,
    getColor,
    getDateFromTimestamp,
    getFormattedDate,
    redirectToPage,
    toSearchWordsArray,
    normalizeGameTitle,
    generateActivityGrid,
    getActivityLevel,
    getActivityColor
}