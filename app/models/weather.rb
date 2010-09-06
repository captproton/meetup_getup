class Weather < ActiveRecord::Base
  validates_presence_of :zipcode
end
