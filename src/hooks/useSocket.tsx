import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

function useSocket() {
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    const socketIo = io(process.env.REACT_APP_SOCKET_URL);

    socketIo.on('connect', () =>{
      console.log('=====connect====');
    })
    
    socketIo.on('disconnect', () =>{
      console.log('=====disconnect====');
    })

    setSocket(socketIo);

    function cleanup() {
      socketIo.disconnect();
    }

    return cleanup;
  }, []);

  return socket;
}

export default useSocket;
