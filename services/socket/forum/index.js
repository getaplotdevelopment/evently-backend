import directMessage from './directMessage';
import groupMessage from './groupMessage';

export default io => {
  const forumNsp = io.of('/forum');

  forumNsp.on('connection', socket => {
    groupMessage({ io, forumNsp, socket });
    directMessage({ io, socket });
  });

  return forumNsp;
};
