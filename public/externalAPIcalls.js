const ALL_GAMEPASS_ID_ADDRESS = "https://catalog.gamepass.com/sigls/v2?id=29a81209-df6f-41fd-a528-2ae6b91f719c&language=en-us&market=US"
const GAMEPASS_DATA_ADDRESS = ["https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=", "&market=US&languages=en-us&MS-CV=DGU1mcuYo0WMMp+F.1"]

const getAllGamePassTitles = async () => {
    var json;

    try {
        const res = await fetch(ALL_GAMEPASS_ID_ADDRESS);
        if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
        }

        json = await res.json();
    } catch (error) {
        console.error(error.message);
    }

    const searchArray = Array.from(json).map(x => x["id"] ? x["id"] : null).filter(x => x != null).join(',')

    try {
        const res = await fetch(GAMEPASS_DATA_ADDRESS[0] + searchArray + GAMEPASS_DATA_ADDRESS[1]);
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

    console.log(result)
}

export {
    getAllGamePassTitles
}