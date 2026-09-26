/** Socket.io — farm rooms for real-time notifications (e.g. disease alerts) */
export const initSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    socket.on('join-farm', (userId) => {
      socket.join(`farm-${userId}`);
    });

    socket.on('disconnect', () => {});
  });
};
