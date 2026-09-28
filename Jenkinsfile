pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'bun install --frozen-lockfile'
            }
        }

        stage("Run Tests") {
            steps {
                sh 'bun test'
            }
        }

        stage('Build Core') {
            steps {
                sh 'cd packages/core && bun run build'
            }
        }


        stage('Build Web') {
            steps {
                sh 'cd apps/web && bun run build'
            }
        }

        stage('Build API') {
            steps {
                sh 'cd apps/api && bun run build:vercel'
            }
        }
    }
}