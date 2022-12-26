import bots from './routes/bots';
import user from './routes/user';
import colorscheme from './routes/colorscheme';

// guaranteed to get dependencies
export default ({app}) => {
	user(app);
    bots(app);
    colorscheme(app);
    return app
}
