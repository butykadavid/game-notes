const getGamePassTitles = async (category) => {
    var json;

    try {
        const res = await fetch(`/api/${category}-gamepass-ids`);

        json = await res.json();
    } catch (error) {
        console.error(error.message);
    }

    return Array.from(json).map(x => x["id"] ? x["id"] : null).filter(x => x != null).join(',')
}

const getGamePassData = async (category) => {
    var json;

    try {
        var res
        var searchArray

        switch (category) {
            case 'all':
                searchArray = await getGamePassTitles(category)
                res = await fetch(`/api/gamepass-data/${searchArray}`);
                break;

            case 'popular':
                searchArray = await getGamePassTitles(category)
                res = await fetch(`/api/gamepass-data/${searchArray}`);
                break;

            case 'recent':
                searchArray = await getGamePassTitles(category)
                res = await fetch(`/api/gamepass-data/${searchArray}`);
                break;

            case 'eaplay':
                searchArray = await getGamePassTitles(category)
                res = await fetch(`/api/gamepass-data/${searchArray}`);
                break;

            case 'uplay':
                searchArray = await getGamePassTitles(category)
                res = await fetch(`/api/gamepass-data/${searchArray}`);
                break;

            default:
                searchArray = await getGamePassTitles("all")
                res = await fetch(`/api/gamepass-data/${searchArray}`);
                break;
        }

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
            ovrRating: x["MarketProperties"][0]["UsageData"][2]["AverageRating"],
            image: x["LocalizedProperties"][0]["Images"][1]["Uri"]
        }
    })

    console.log(json)

    return result
}

export {
    getGamePassData
}