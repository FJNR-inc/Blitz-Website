pipeline {
  agent {
    docker {
      image 'node:14.18'
    }
  }
  environment {
    HOME = '.'
  }
  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      parallel {
        stage('Static code analysis') {
          steps {
            sh '''
            # No linting
            '''
          }
        }
        stage('Unit tests') {
          steps {
            sh '''
            # No unit test
            '''
          }
        }
      }
    }
    stage('Build Prod') {
      steps {
        sh 'npm run build:prod'
      }
    }
    stage('Build QA') {
      steps {
        sh 'npm run build:qa'
      }
    }
    stage('deploy QA') {
      when{
        expression {
          return env.BRANCH_NAME == 'develop';
        }
      }
      steps {
        sh '''
        # Create Nginx image based on dist/qa
        # Push new image to a container registry
        # Deploy the last QA image on the QA server
        # Notify development team that QA server has been updated (Slack ? Custom dashboard ?)
        '''
      }
    }
    stage('Store official image') {
      when{
        expression {
          return env.BRANCH_NAME == 'master';
        }
      }
      steps {
        sh '''
        # Create Nginx image based on dist/prod
        # Push new image to a container registry
        # Notify development team that a new production image is ready to use
        '''
      }
    }
    stage("Final Cleanup") {
      steps {
        cleanWs deleteDirs: true, notFailBuild: true
      }
    }
  }
}
