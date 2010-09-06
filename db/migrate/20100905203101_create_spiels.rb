class CreateSpiels < ActiveRecord::Migration
  def self.up
    create_table :spiels do |t|
      t.string :version

      t.timestamps
    end
  end

  def self.down
    drop_table :spiels
  end
end
