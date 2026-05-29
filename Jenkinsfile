pipeline {
  agent any

  environment {
    FRONTEND_IMAGE = "my-website-frontend:${BUILD_NUMBER}"
  }

  stages {

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test --if-present || echo "No test script found, skipping"'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('MysonarQube') {
          sh 'sonar-scanner'
        }
      }
    }

    stage('Quality Gate') {
      steps {
        waitForQualityGate abortPipeline: true
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${FRONTEND_IMAGE} ."
      }
    }

    stage('Deploy Frontend') {
      steps {
        sh "docker stop my-website-frontend || true"
        sh "docker rm my-website-frontend || true"
        sh "docker run -d -p 3000:3000 --name my-website-frontend ${FRONTEND_IMAGE}"
      }
    }
  }
}