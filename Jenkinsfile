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

        stage('Run Application'){
            steps{
                sh '''
                    API_IMAGE=fifo-api:jenkins \
                    WEB_IMAGE=fifo-web:jenkins \
                    docker compose up -d
                '''
            }
        }

    }
}
