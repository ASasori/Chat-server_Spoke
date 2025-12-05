pipeline {
    agent { label 'docker-agent' }

    triggers {
        githubPush()
    }

    environment {
        IMAGE_NAME = "chatai-spoke"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "chatai-spoke"
        HOST_PORT = "8001"
        CONTAINER_PORT = "8001"
        // Tên mạng Docker chung với Backend (Quan trọng)
        DOCKER_NETWORK = "chatserver-spoke_chat_network"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out branch hoangdn/feat-server-ai-ws..."
                git branch: 'hoangdn/feat-server-ai-ws', url: 'https://github.com/ASasori/Chat-server_Spoke.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying container..."
                script {
                    // 1. Dọn dẹp container cũ
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"

                    // 2. Xóa file .env cũ để tránh lỗi Permission denied
                    sh "rm -f .env || true"

                    // 3. Lấy file cấu hình từ Jenkins (Dùng ID ai-server-env mới tạo)
                    withCredentials([file(credentialsId: 'ai-server-env', variable: 'SECRET_FILE')]) {
                        sh 'cp $SECRET_FILE .env'
                    }

                    // 4. Chạy container (Viết liền 1 dòng để tránh lỗi cú pháp)
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart always \
                        --env-file .env \
                        --network ${DOCKER_NETWORK} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deploy DONE! AI Server is running."
        }
        failure {
            echo "Deploy FAILED!"
        }
    }
}