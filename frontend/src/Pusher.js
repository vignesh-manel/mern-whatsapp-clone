import Pusher from "pusher-js";

const pusher = new Pusher(process.env.REACT_APP_pusherKey, {
  cluster: 'ap2'
});

export default pusher;
