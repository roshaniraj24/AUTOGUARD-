FROM python:3.11-slim

WORKDIR /ansible

# Install system dependencies
RUN apt-get update && apt-get install -y \
    openssh-client \
    sshpass \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Ansible and dependencies
RUN pip install --no-cache-dir \
    ansible==8.1.0 \
    docker==6.1.3 \
    pyyaml==6.0

# Copy Ansible files
COPY . .

# Create SSH directory and set permissions
RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh

# Generate SSH key for container-to-container communication
RUN ssh-keygen -t rsa -b 4096 -f /root/.ssh/id_rsa -N ""

CMD ["tail", "-f", "/dev/null"]