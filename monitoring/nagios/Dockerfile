FROM jasonrivers/nagios:latest

# Install additional monitoring plugins
RUN apt-get update && apt-get install -y \
    nagios-plugins-contrib \
    nagios-nrpe-plugin \
    && rm -rf /var/lib/apt/lists/*

# Copy custom configuration
COPY etc/ /opt/nagios/etc/

# Set proper permissions
RUN chown -R nagios:nagios /opt/nagios/etc/

EXPOSE 80