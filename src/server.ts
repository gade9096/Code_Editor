@@ .. @@
 		// Load room data from database and send to user
 		RoomService.getRoomData(roomId).then(roomData => {
 			if (roomData) {
 				io.to(socket.id).emit(SocketEvent.SYNC_FILE_STRUCTURE, {
 					fileStructure: roomData.fileStructure,
 					openFiles: roomData.openFiles,
 					activeFile: roomData.activeFile,
 				})
 
 				if (roomData.drawingData) {
 					io.to(socket.id).emit(SocketEvent.SYNC_DRAWING, {
 						drawingData: roomData.drawingData
 					})
 				}
 			} else {
 				// Create new room with default structure
 				RoomService.createOrUpdateRoom(roomId)
 			}
 		})
 
-		// Load chat history
-		ChatService.getRoomMessages(roomId).then(messages => {
-			// Send messages in chronological order
-			const sortedMessages = messages.reverse()
-			sortedMessages.forEach(msg => {
-				io.to(socket.id).emit(SocketEvent.RECEIVE_MESSAGE, {
-					message: {
-						id: msg.messageId,
-						message: msg.message,
-						username: msg.username,
-						timestamp: msg.timestamp
-					}
-				})
-			})
-		})
+		// Load and send chat history
+		ChatService.getRoomMessages(roomId).then(messages => {
+			const formattedMessages = messages.map(msg => ({
+				id: msg.messageId,
+				message: msg.message,
+				username: msg.username,
+				timestamp: msg.timestamp
+			}))
+			
+			io.to(socket.id).emit(SocketEvent.CHAT_HISTORY, {
+				messages: formattedMessages
+			})
+		})
 	})
 
 	socket.on("disconnecting", () => {
@@ .. @@
 			.emit(SocketEvent.RECEIVE_MESSAGE, { message })
 	})
 
+	// Handle chat history request
+	socket.on(SocketEvent.REQUEST_CHAT_HISTORY, () => {
+		const roomId = getRoomId(socket.id)
+		if (!roomId) return
+		
+		ChatService.getRoomMessages(roomId).then(messages => {
+			const formattedMessages = messages.map(msg => ({
+				id: msg.messageId,
+				message: msg.message,
+				username: msg.username,
+				timestamp: msg.timestamp
+			}))
+			
+			io.to(socket.id).emit(SocketEvent.CHAT_HISTORY, {
+				messages: formattedMessages
+			})
+		})
+	})
+
 	// Handle cursor position
 	socket.on(SocketEvent.TYPING_START, ({ cursorPosition }) => {