pipeline {
    agent any


    stages {
        stage('Stop') {
            steps {
              catchError(buildResult:'SUCCESS', stageResult:'SUCCESS'){
                echo 'Stopping container'
                sh "docker stop ecommerce-frontend"
                }
        }}

        stage('Remove') {
            steps {
                catchError(buildResult:'SUCCESS', stageResult:'SUCCESS'){
                    echo 'Removing container and deletng all local images'
                    sh "docker rm ecommerce-frontend"
                    sh "docker image prune -af"
                    sh "docker builder prune -af"
                }

            }
        }

        stage('Build') {
            steps {
                echo 'Building image'
                sh "docker build --force-rm -t 'ecommerce-frontend' . "
            }
        }

        stage('Run') {
            steps {
                echo 'Runing container'
                sh "docker run -d -p 55501:3000 --name ecommerce-frontend ecommerce-frontend"
            }
        }

 }}


