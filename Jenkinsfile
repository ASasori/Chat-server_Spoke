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
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                """
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying container..."
                sh """
                    # Stop và remove container cũ nếu có
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    # Run container mới, expose port, mount env
                    docker run -d --name ${CONTAINER_NAME} \
                        --env-file ${ENV_FILE} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "Deploy DONE!"
        }
        failure {
            echo "Deploy FAILED!"
        }
    }
}
