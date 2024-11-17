const ALL_GAMEPASS_ID_ADDRESS = "https://catalog.gamepass.com/sigls/v2?id=29a81209-df6f-41fd-a528-2ae6b91f719c&language=en-us&market=US"
const POPULAR_GAMEPASS_ID_ADDRESS = "https://catalog.gamepass.com/sigls/v2?id=eab7757c-ff70-45af-bfa6-79d3cfb2bf81&language=en-us&market=US"
const EAPLAY_GAMEPASS_ID_ADDRESS = "https://catalog.gamepass.com/sigls/v2?id=b8900d09-a491-44cc-916e-32b5acae621b&language=en-us&market=US"
const RECENT_GAMEPASS_ID_ADDRESS = "https://catalog.gamepass.com/sigls/v2?id=f13cf6b4-57e6-4459-89df-6aec18cf0538&language=en-us&market=US"
const UPLAY_GAMEPASS_ID_ADDRESS = "https://catalog.gamepass.com/sigls/v2?id=a5a535fb-d926-4141-9ce4-9f6af8ca22e7&language=en-us&market=US"
const GAMEPASS_DATA_ADDRESS = ["https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=", "&market=US&languages=en-us&MS-CV=DGU1mcuYo0WMMp+F.1"]

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
		return [
			{
				source: '/api/all-gamepass-ids',
				destination: `${ALL_GAMEPASS_ID_ADDRESS}`,
			},
            {
                source: '/api/popular-gamepass-ids',
                destination: `${POPULAR_GAMEPASS_ID_ADDRESS}`
            },
            {
                source: '/api/recent-gamepass-ids',
                destination: `${RECENT_GAMEPASS_ID_ADDRESS}`
            },
            {
                source: '/api/eaplay-gamepass-ids',
                destination: `${EAPLAY_GAMEPASS_ID_ADDRESS}`
            },
            {
                source: '/api/uplay-gamepass-ids',
                destination: `${UPLAY_GAMEPASS_ID_ADDRESS}`
            },
            {
                source: '/api/gamepass-data/:searchList',
                destination: `${GAMEPASS_DATA_ADDRESS[0]}:searchList${GAMEPASS_DATA_ADDRESS[1]}`
            }
		]
	},
    env: {
        ADMIN: process.env.ADMIN,
    },
}

module.exports = nextConfig
