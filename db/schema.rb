# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160306203047) do

  create_table "clients", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "address"
    t.string   "city"
    t.string   "state"
    t.string   "zip"
    t.string   "phone"
    t.boolean  "is_primary", default: false
    t.integer  "user_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "clients", ["user_id"], name: "index_clients_on_user_id"

  create_table "invoices", force: :cascade do |t|
    t.integer  "invoice_number"
    t.datetime "created_at",                                                    null: false
    t.datetime "updated_at",                                                    null: false
    t.boolean  "archived",                                      default: false
    t.date     "date"
    t.date     "due_date"
    t.string   "name"
    t.string   "address_line1"
    t.string   "address_line2"
    t.string   "phone"
    t.string   "client_name"
    t.string   "client_address_line1"
    t.string   "client_address_line2"
    t.text     "notes"
    t.decimal  "total",                precision: 15, scale: 4
    t.integer  "user_id"
    t.integer  "client_id"
    t.decimal  "amount_paid",          precision: 15, scale: 4
    t.decimal  "balance",              precision: 15, scale: 4
    t.string   "logo",                                          default: ""
  end

  add_index "invoices", ["client_id"], name: "index_invoices_on_client_id"
  add_index "invoices", ["user_id"], name: "index_invoices_on_user_id"

  create_table "jobs", force: :cascade do |t|
    t.text     "job_description"
    t.decimal  "job_quantity",    precision: 15, scale: 4
    t.decimal  "job_rate",        precision: 15, scale: 4
    t.integer  "invoice_id"
    t.datetime "created_at",                                               null: false
    t.datetime "updated_at",                                               null: false
    t.boolean  "will_delete",                              default: false
  end

  add_index "jobs", ["invoice_id"], name: "index_jobs_on_invoice_id"

  create_table "logos", force: :cascade do |t|
    t.integer  "user_id"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "image"
    t.boolean  "current_logo", default: true
  end

  add_index "logos", ["user_id"], name: "index_logos_on_user_id"

  create_table "settings", force: :cascade do |t|
    t.integer  "base_invoice_number", default: 1
    t.integer  "user_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  add_index "settings", ["user_id"], name: "index_settings_on_user_id"

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "name"
    t.string   "address"
    t.string   "city"
    t.string   "state"
    t.string   "zip"
    t.string   "phone"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
