import bots from './routes/bots';
import user from './routes/user';

// guaranteed to get dependencies
export default ({app}) => {
	user(app);
    bots(app);
    return app
}
