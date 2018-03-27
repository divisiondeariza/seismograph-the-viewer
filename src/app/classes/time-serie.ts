export class TimeSerie {
	values:LineChartDatum[];
	key:String;
	color?:String;
}


class LineChartDatum{
	y:Number;
	x:Date;
}