const ALL_GAMEPASS_ID_ADDRESS = "https://catalog.gamepass.com/sigls/v2?id=29a81209-df6f-41fd-a528-2ae6b91f719c&language=en-us&market=US"
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
                source: '/api/gamepass-game-data/:searchList',
                destination: `${GAMEPASS_DATA_ADDRESS[0]}:searchList${GAMEPASS_DATA_ADDRESS[1]}`
            }
		]
	},
    env: {
        ADMIN: process.env.ADMIN,
    },
}

module.exports = nextConfig
