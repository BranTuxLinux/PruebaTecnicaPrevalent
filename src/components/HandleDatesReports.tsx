import React, {
  Dispatch,
  FormEvent,
  FormEventHandler,
  SetStateAction,
  useState,
} from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ApolloQueryResult } from "@apollo/client";
type IDate = {
  startDate: string;
  endDate: string;
};
interface IDatesReports {
  date: IDate;
  setDate: Dispatch<SetStateAction<IDate>>;
  handleRecharge: () => Promise<ApolloQueryResult<any>>;
}
export const HandleDatesReports: React.FC<IDatesReports> = ({
  date,
  setDate,
}) => {
  const [newDate, setNewDate] = useState({
    startDate: date.startDate,
    endDate: date.endDate,
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(newDate);
    setDate((prev) => ({
      ...prev,
      startDate: newDate.startDate,
      endDate: newDate.endDate,
    }));
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2">
        <div className="col-span-3">
          <Label htmlFor="date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {newDate.startDate
                  ? format(newDate.startDate, "PPP")
                  : "Pick a Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  newDate.startDate ? new Date(newDate.startDate) : undefined
                }
                onSelect={(date) => {
                  setNewDate((prev) => ({
                    ...prev,
                    startDate: new Date(date || new Date()).toISOString(),
                  }));
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("2000-01-01")
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="col-span-3">
          <Label htmlFor="date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {newDate.endDate
                  ? format(newDate.endDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  newDate.endDate ? new Date(newDate.endDate) : undefined
                }
                onSelect={(date) => {
                  setNewDate((prev) => ({
                    ...prev,
                    endDate: new Date(date || new Date()).toISOString(),
                  }));
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("2000-01-01")
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button type="submit">Change Date</Button>
      </div>
    </form>
  );
};
