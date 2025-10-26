pipeline {
    // 1. Tên agent của bạn
    agent { label 'docker-agent' }

    stages {
        stage('Checkout') {
            steps {
                // 1. Dùng URL SSH (không phải HTTPS)
                // 2. Thêm credentialsId (từ log của bạn)
                git branch: 'main', 
                    url: 'git@github.com:ASasori/Chat-server_Spoke.git'
                    //credentialsId: 'jenkins-agent-ssh-key'
            }
        }
        stage('Build Docker Image') {
            steps {
                // 3. Đặt tên image là 'chat-server'
                sh 'docker build -t chat-server:latest .'
            }
        }

        stage('Security Scan (Trivy)') {
            steps {
                sh '''
                if ! command -v trivy &> /dev/null
                then
                    echo "Skipping scan: Trivy not installed"
                else
                    // 4. Scan image 'chat-server'
                    trivy image chat-server:latest || true
                fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                // 5. ⭐️ PHẦN QUAN TRỌNG NHẤT: Nạp file .env
                // 'chat-server-env' là ID bạn tạo ở Bước 1
                // '.env.prod' là tên file tạm thời nó tạo ra
                withCredentials([file(credentialsId: 'chat-server-env', variable: 'DOT_ENV_FILE')]) {
                    sh '''
                    echo "Deploying Chat Server..."
                    
                    # 6. Dừng và xóa container tên 'chat-server' (nếu có)
                    docker rm -f chat-server || true
                    
                    # 7. Chạy container mới
                    # --name chat-server (tên mới)
                    # -p 3000:3000 (port mới, khớp với .env)
                    # --env-file $DOT_ENV_FILE (nạp file .env bí mật)
                    # chat-server:latest (image mới)
                    docker run -d --name chat-server -p 3000:3000 --env-file $DOT_ENV_FILE chat-server:latest
                    
                    echo "Deployment complete."
                    '''
                }
            }
        }
    }
}