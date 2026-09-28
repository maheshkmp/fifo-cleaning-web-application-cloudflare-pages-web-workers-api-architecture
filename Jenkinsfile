pipeline {
    agent any

    stages {
        stage('Check Tools') {
            steps {
                sh 'git --version'
                sh 'java -version'
                sh 'docker --version'
                sh 'bun --version'
            }
        }
        stage('Checkout') {
            steps{
                checkout scm
            }
        }
    }   
}