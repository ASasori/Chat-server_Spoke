pipeline {
    agent { label 'docker-agent' }

    environment {
        IMAGE_NAME = "chat-server"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "chat-server"
        ENV_FILE = ".env"
        PORT = "3001"  // Port chat-server chạy
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out branch ${env.BRANCH_NAME}..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image for chat-server..."
                script {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying with Docker Compose..."
                script {
                    // 1. Cố gắng lấy lại quyền sở hữu thư mục hiện tại (fix lỗi Permission denied)
                    // Dùng '|| true' để nếu không có sudo thì cũng không bị fail pipeline
                    sh "sudo chown -R \$(whoami) . || true"
                    
                    // 2. Xóa file .env cũ đi trước khi copy cái mới
                    sh "rm -f .env"

                    // 3. Tắt container cũ
                    sh "docker compose down || true"

                    // 4. Lấy file .env từ Jenkins Credentials
                    withCredentials([file(credentialsId: 'chat-server-env', variable: 'SECRET_FILE')]) {
                        sh 'cp $SECRET_FILE .env'
                    }

                    // 5. Sửa connection string trong .env (localhost -> mongo)
                    sh "sed -i 's/127.0.0.1/mongo/g' .env"
                    sh "sed -i 's/localhost/mongo/g' .env"

                    // 6. Chạy Docker Compose
                    sh "docker compose up -d --build"
                }
            }
        }

        stage('Post-Deploy Check') {
            steps {
                echo "Verifying container is running..."
                sh "docker ps -f name=${CONTAINER_NAME}"
            }
        }
    }

    post {
        success {
            echo "Chat-server deployed successfully!"
        }
        failure {
            echo "Chat-server deployment FAILED!"
        }
    }
}