#
# Cookbook Name:: BeamStreamPlay
# Recipe:: default
#
# Copyright 2013, BeamStream
#
# All rights reserved - Do Not Redistribute
#

execute "apt-get update" do
    command "apt-get update"
    action :run
end

package "python-git" do
	action :upgrade
end

package "openjdk-6-jdk" do
	action :upgrade
end

package "mongodb" do
  action :upgrade
end

package "unzip" do
	action :upgrade
end

directory '/playframework' do
  owner "vagrant"
  mode "0777"
  action :create
end


execute "wget_play" do
	not_if {File.exists?('/playframework/play-2.0.2/')} #skip this if it already exists - bypasses overwrite conflict errors

  cwd '/tmp'
	play_release = "play-2.0.2.zip"
	play_url = "http://downloads.typesafe.com/releases/#{play_release}"
	command "wget #{play_url} && unzip -o #{play_release} -d /playframework/ "
	action :run
end

execute "chown_playframework" do
  command "chown vagrant:vagrant /playframework -R ; chmod 777 /playframework -R"
  action :run
end


template "/etc/init/beamstream.conf" do
  source "beamstream.conf.erb"
  owner "vagrant"
  group "vagrant"
  mode "0600"
end

service "beamstream" do
  provider Chef::Provider::Service::Upstart
  retries 0
  retry_delay 2
  action :start
end