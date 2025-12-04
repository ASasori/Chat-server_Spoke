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
                    // Stop & remove container nếu tồn tại
                    sh """
                        if [ \$(docker ps -aq -f name=${CONTAINER_NAME}) ]; then
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                        fi
                    """

                    // Kiểm tra env file
                    sh """
                        if [ ! -f ${ENV_FILE} ]; then
                            echo "${ENV_FILE} not found! Please provide it."
                            exit 1
                        fi
                    """

                    // Chạy container
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        --env-file ${ENV_FILE} \
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
