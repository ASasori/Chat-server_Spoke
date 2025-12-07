import { io } from "socket.io-client";

// ============================================================
// 1. CẤU HÌNH
// ============================================================

const URL = "https://chatserver.kazekageiii.xyz";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTM0NGM2MDFkODY2YmU4YjQ2NmQ2NTIiLCJpYXQiOjE3NjUwMzUxMDQsImV4cCI6MTc2NTEyMTUwNH0.caPEGyu__t7bcBFRAQ5HCY74UetbtsDVj1WDJCFPUNM"; 

const testResults = {
    "INF_03": { desc: "Bảo mật: Chặn kết nối không Token", status: "PENDING" },
    "INF_04": { desc: "Hệ thống: Kết nối thành công với Token", status: "PENDING" }, // Test phụ để đảm bảo chạy được các test sau
    "MSG_02": { desc: "Bắt đầu chat mới (New Session)", status: "PENDING" },
    "MSG_03": { desc: "Chat tiếp session cũ (History)", status: "PENDING" },
    "MSG_04": { desc: "Check lỗi input rỗng", status: "PENDING" },
    "MSG_05": { desc: "Nhận Report từ AI", status: "PENDING" } 
};

const markPass = (id) => { if (testResults[id]) testResults[id].status = "PASS"; };
const markFail = (id) => { if (testResults[id]) testResults[id].status = "FAIL"; };

const printSummary = () => {
    console.log("\n==================================================");
    console.log("             KẾT QUẢ KIỂM THỬ TỰ ĐỘNG             ");
    console.log("==================================================");
    console.table(testResults);
    const allPassed = Object.values(testResults).every(t => t.status === "PASS");
    if (allPassed) console.log("\x1b[32m%s\x1b[0m", ">>> TẤT CẢ TEST CASE ĐỀU ĐẠT (PASS) <<<");
    else console.log("\x1b[33m%s\x1b[0m", ">>> CÓ TEST CASE CHƯA HOÀN THÀNH HOẶC LỖI <<<");
    console.log("==================================================\n");
};

console.log("--- BẮT ĐẦU TEST SOCKET ---");

// ============================================================
// 2. TEST CASE INF_03 (BẢO MẬT - KHÔNG TOKEN)
// ============================================================
console.log(">> [INF_03] Đang thử kết nối không Token (Mong đợi bị từ chối)...");
const badSocket = io(URL, { 
    auth: {}, // KHÔNG GỬI TOKEN
    reconnection: false // Không thử kết nối lại
});

badSocket.on("connect", () => {
    console.log("[FAIL] INF_03: Server chấp nhận kết nối không token! (Lỗ hổng bảo mật)");
    markFail("INF_03");
    badSocket.disconnect();
});

badSocket.on("connect_error", (err) => {
    console.log(`[PASS] INF_03: Kết nối bị từ chối đúng như mong đợi. Lỗi: ${err.message}`);
    markPass("INF_03");
    
    // Sau khi test bảo mật xong, mới chạy kết nối chính
    startMainConnection();
});


// ============================================================
// 3. MAIN CONNECTION (CÓ TOKEN - ĐỂ TEST MESSAGE)
// ============================================================
function startMainConnection() {
    if (!TOKEN) { console.error("LỖI: Chưa có TOKEN"); process.exit(1); }

    const socket = io(URL, { auth: { token: TOKEN } });

    socket.on("connect", () => {
        console.log(`[PASS] INF_04: Kết nối chính thành công ID: ${socket.id}`);
        markPass("INF_04");
        
        // MSG_02: Bắt đầu chat mới
        console.log(">> [MSG_02] Đang gửi câu hỏi mới...");
        socket.emit("ask-question", { question: "Xin chào AI, bạn là ai?" });
    });

    socket.on("connect_error", (err) => {
        console.log(`[FAIL] Lỗi kết nối chính: ${err.message}`);
        // Nếu kết nối chính fail thì các test sau cũng fail
        process.exit(1);
    });

    socket.on("server-report", (data) => {
        if (testResults["MSG_05"].status !== "PASS") {
            console.log(`[INFO] Đã nhận được AI Report.`);
            markPass("MSG_05");
        }
    });

    socket.on("receive-answer", (data) => {
        console.log(`[INFO] Nhận câu trả lời: "${data.answer.substring(0, 30)}..."`);
        
        if (!socket.hasFinishedFirstChat) {
            markPass("MSG_02");
            socket.hasFinishedFirstChat = true;

            if (data.chatSessionId) {
                console.log(">> [MSG_03] Đang test chat tiếp session cũ...");
                setTimeout(() => {
                    socket.emit("ask-question", { 
                        question: "Cảm ơn nhé!", 
                        chatSessionId: data.chatSessionId 
                    });
                }, 2000);
            }
        } else {
            markPass("MSG_03");
            setTimeout(() => {
                console.log("--- HOÀN THÀNH TEST ---");
                printSummary();
                socket.disconnect();
                // Đóng luôn badSocket nếu nó còn treo (dù đã xử lý ở trên)
                badSocket.close();
            }, 500);
        }
    });

    // MSG_04: Gửi câu hỏi rỗng
    setTimeout(() => {
        console.log(">> [MSG_04] Test gửi câu hỏi rỗng...");
        socket.emit("ask-question", { question: "" });
    }, 1000);

    socket.on("error-message", (data) => {
        console.log(`[INFO] Nhận thông báo lỗi: ${data.message}`);
        if (data.message.toLowerCase().includes("couldn't find") || data.message.toLowerCase().includes("missing")) {
            markPass("MSG_04");
        }
    });
}