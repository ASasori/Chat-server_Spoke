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
                echo "Deploying chat-server container..."
                script {
                    // 1. Stop & remove container cũ nếu tồn tại
                    sh """
                        if [ \$(docker ps -aq -f name=${CONTAINER_NAME}) ]; then
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                        fi
                    """

                    // 2. LẤY FILE .ENV TỪ JENKINS CREDENTIALS [QUAN TRỌNG]
                    // ID 'chat-server-env' lấy từ ảnh bạn gửi
                    withCredentials([file(credentialsId: 'chat-server-env', variable: 'SECRET_FILE')]) {
                        // Copy file bí mật từ Jenkins vào thư mục làm việc và đặt tên là .env
                        sh 'cp $SECRET_FILE .env'
                    }

                    // 3. Kiểm tra lại xem file .env đã có chưa (Giờ thì chắc chắn sẽ có)
                    sh """
                        if [ ! -f .env ]; then
                            echo ".env not found! Please provide it."
                            exit 1
                        fi
                    """

                    // 4. Chạy container với file .env vừa lấy được
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        --env-file .env \
                        -p ${PORT}:${PORT} \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                    """
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