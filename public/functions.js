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

const toggleOrdering = (event, category, orderingContainer, setOrdering, styles) => {
    Array.from(orderingContainer.current.children).forEach(e => {
        if (e == event.target && e.classList.contains(styles.toggled)) {
            e.classList.remove(styles.toggled)
            setOrdering('none')
        }
        else if (e == event.target && !e.classList.contains(styles.toggled)) {
            e.classList.add(styles.toggled)
            setOrdering(category)
        }
        else if (!e == event.target) e.classList.remove(styles.toggled)
    })
}

const toggleDirection = (event, directionContainer, setDirection, styles) => {
    Array.from(directionContainer.current.children).forEach(e => {
        if (e == event.target && !e.classList.contains(styles.toggled)) {
            e.classList.add(styles.toggled)
            setDirection(event.target.innerHTML)
        }
        else if (e == event.target && e.classList.contains(styles.toggled)) return
        else if (!e == event.target) e.classList.remove(styles.toggled)
    })
}

const activateOrdering = (ordering, direction, setItems, items) => {
    if (direction === 'ASC') {
        if (ordering === "overall") setItems([...items].sort((a, b) => getOvrRating(a) - getOvrRating(b)))
        else if (ordering === "none") setItems([...items].sort((a, b) => b["title"] - a["title"]))
        else setItems([...items].sort((a, b) => a[ordering] - b[ordering]))
    }
    else {
        if (ordering === "overall") setItems([...items].sort((a, b) => getOvrRating(b) - getOvrRating(a)))
        else if (ordering === "none") setItems([...items].sort((a, b) => a["title"] - b["title"]))
        else setItems([...items].sort((a, b) => b[ordering] - a[ordering]))
    }
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

export {
    getOvrRating,
    getColor,
    getDateFromTimestamp,
    getFormattedDate,
    redirectToPage,
    toSearchWordsArray,
    toggleOrdering,
    toggleDirection,
    activateOrdering,
    normalizeGameTitle
}