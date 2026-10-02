pipeline {
    agent any

    stages {

        stage('Get Git Commit') {
            steps {
                script {
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    echo "Docker image tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build API Docker Image') {
            steps {
                sh '''
                    docker build \
                      -f apps/api/Dockerfile \
                      -t fifo-api:${IMAGE_TAG} \
                      .
                '''
            }
        }

        stage('Build Web Docker Image') {
            steps {
                sh '''
                    docker build \
                      --build-arg NEXT_PUBLIC_BACKEND_URL=http://api:4000 \
                      -f apps/web/Dockerfile \
                      -t fifo-web:${IMAGE_TAG} \
                      .
                '''
            }
        }

        stage('Tag Images for GHCR') {
            steps {
                sh '''
                    docker tag fifo-api:${IMAGE_TAG} \
                        ghcr.io/maheshkmp/fifo-api:${IMAGE_TAG}

                    docker tag fifo-web:${IMAGE_TAG} \
                        ghcr.io/maheshkmp/fifo-web:${IMAGE_TAG}
                '''
            }
        }

        stage('Test GHCR Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'ghcr-credentials',
                        usernameVariable: 'GHCR_USER',
                        passwordVariable: 'GHCR_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "$GHCR_TOKEN" | docker login ghcr.io \
                            -u "$GHCR_USER" \
                            --password-stdin
                    '''
                }
            }
        }

        stage('Push Images to GHCR') {
            steps {
                sh '''
                    docker push ghcr.io/maheshkmp/fifo-api:${IMAGE_TAG}
                    docker push ghcr.io/maheshkmp/fifo-web:${IMAGE_TAG}
                '''
            }
        }

        stage('Run Application') {
            steps {
                sh '''
                    export API_IMAGE=ghcr.io/maheshkmp/fifo-api:latest
                    export WEB_IMAGE=ghcr.io/maheshkmp/fifo-web:latest

                    docker compose pull
                    docker compose up -d
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Checking web..."
                    curl -f http://localhost:3000

                    echo "Checking API..."
                    curl -f http://localhost:4000/api/reference

                    echo "Health checks passed."
                '''
            }
        }
    }
}