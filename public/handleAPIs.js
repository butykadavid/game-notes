const getAllGamePassTitles = async () => {
    var json;

    try {
        const res = await fetch('/api/all-gamepass-ids');

        json = await res.json();
    } catch (error) {
        console.error(error.message);
    }

    const searchArray = Array.from(json).map(x => x["id"] ? x["id"] : null).filter(x => x != null).join(',')

    try {
        const res = await fetch(`/api/gamepass-game-data/${searchArray}`);
        if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
        }

        json = await res.json();
    } catch (error) {
        console.error(error.message);
    }

    const result = json["Products"].map(x => {
        return {
            title: x["LocalizedProperties"][0]["ProductTitle"],
            recentRating: x["MarketProperties"][0]["UsageData"][1]["AverageRating"],
            ovrRating: x["MarketProperties"][0]["UsageData"][2]["AverageRating"]
        }
    })

    return result
}

export {
    getAllGamePassTitles
}