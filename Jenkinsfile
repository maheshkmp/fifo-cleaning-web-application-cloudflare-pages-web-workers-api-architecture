pipeline {
    agent any

    stages {

        stage('Build API Docker Image') {
            steps {
                sh '''
                    docker build \
                      -f apps/api/Dockerfile \
                      -t fifo-api:jenkins \
                      .
                '''
}
            }
        }

        stage('Build Web Docker Image') {
            steps {
                sh '''
                    docker build \
                      --build-arg NEXT_PUBLIC_BACKEND_URL=http://api:4000 \
                      -f apps/web/Dockerfile \
                      -t fifo-web:jenkins \
                      .
                '''
            }
        }
        
        stage('Tag Images for GHCR') {
            steps {
                sh '''
                    docker tag fifo-api:jenkins \
                        ghcr.io/maheshkmp/fifo-api:latest

                    docker tag fifo-web:jenkins \
                        ghcr.io/maheshkmp/fifo-web:latest
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
        stage('Run Application'){
            steps{
                sh '''
                    API_IMAGE=fifo-api:jenkins \
                    WEB_IMAGE=fifo-web:jenkins \
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

