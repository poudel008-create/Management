import Mux from "@mux/ts";
const mux=new Mux({
    tokenId:process.env.MUX_TOKEN_ID,
    tokenSecret:process.env.MUX_TOKEN_SECRET
})

export default mux
