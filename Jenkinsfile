pipeline {
    agent { label 'docker-agent' }

    triggers {
        githubPush()
    }

    environment {
        IMAGE_NAME = "chatai-spoke"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "chatai-spoke"
        ENV_FILE = ".env" 
        HOST_PORT = "8001"
        CONTAINER_PORT = "8001"
        // Tên network bạn muốn join
        DOCKER_NETWORK = "chatserver-spoke_chat_network" 
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out branch hoangdn/feat-server-ai-ws..."
                // Lưu ý: Đảm bảo branch này đúng với repo của bạn
                git branch: 'hoangdn/feat-server-ai-ws', url: 'https://github.com/ASasori/Chat-server_Spoke.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                """
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying container..."
                script {
                    // 1. Dọn dẹp container cũ
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"

                    // 2. [QUAN TRỌNG] Lấy file .env từ Jenkins Credentials
                    // ID 'chat-server-env' phải khớp với ID bạn tạo trong Jenkins
                    withCredentials([file(credentialsId: 'chat-server-env', variable: 'SECRET_FILE')]) {
                        sh 'cp $SECRET_FILE .env'
                    }

                    // 3. Chạy container mới với Network
                    sh """
                        docker run -d --name ${CONTAINER_NAME} \
                            --restart always \
                            --env-file ${ENV_FILE} \
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
            echo "Deploy DONE! Container connected to ${DOCKER_NETWORK}"
        }
        failure {
            echo "Deploy FAILED!"
        }
    }
}