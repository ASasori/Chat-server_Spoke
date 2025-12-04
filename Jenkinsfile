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
                    // 1. [FIX QUAN TRỌNG] Xóa cứng container cũ nếu nó đang tồn tại (bất kể tạo bằng docker run hay compose)
                    // Dùng '|| true' để nếu không có container thì cũng không báo lỗi
                    sh "docker rm -f chat-server || true"

                    // 2. Tắt các service trong stack compose cũ
                    sh "docker compose down || true"

                    // 3. Xóa file .env cũ
                    sh "rm -f .env"

                    // 4. Lấy file .env mới từ Jenkins
                    withCredentials([file(credentialsId: 'chat-server-env', variable: 'SECRET_FILE')]) {
                        sh 'cp $SECRET_FILE .env'
                    }

                    // 5. Sửa connection string (localhost -> mongo)
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