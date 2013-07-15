#
# Cookbook Name:: BeamStreamPlay
# Recipe:: default
#
# Copyright 2013, BeamStream
#
# All rights reserved - Do Not Redistribute
#


package "python-git" do
	action :upgrade
end

package "openjdk-6-jdk" do
	action :upgrade
end

execute "wget_play" do
	cwd '/tmp'
	play_release = 'play-2.0.2.zip'
	play_url = 'http://downloads.typesafe.com/releases/#{play_release}'
	command "wget #{play_url}"
	action :run
end
